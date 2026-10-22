---
project: iot-physical-security-challenge
---

I bought a D-Link DCS-5030L camera from Carousell for $10 because I wanted to get my hands dirty with IoT hacking. I had no fancy lab and no real hardware-reversing experience—just a cheap camera, a multimeter, a USB serial adapter, a CH341A flash reader, and a lot of trial and error.

<figure class="project-evidence">
  <img src="/personal_blog/images/dlink-camera/carousell-listing.jpg" alt="Original Carousell listing for the used D-Link camera and its accessories, priced at S$10" loading="lazy" />
  <figcaption>The listing that started it: a used camera and its accessories for S$10.</figcaption>
</figure>

I did not start by hunting for a camera with a known issue attached to it. I wanted to buy something cheap, take it apart, and see where my own testing would lead.

I used the [Embedded Device Hacking guide](https://www.iotpentestingguide.com/chapter1.html) as a loose map. Its first chapter starts with the sensible stuff: inspect the device, look up its identifiers, open it up, identify exposed interfaces, then inspect the software stored on the flash chip. That gave me a route through a device that initially just looked like a plastic camera shell.

By the end, I had followed three routes into it: the small serial connection on its circuit board, the chip that stores its software, and its Ethernet connection.

<figure class="project-evidence">
  <img src="/personal_blog/images/dlink-camera/camera-in-mug-setup.png" alt="Open D-Link camera balanced in a mug beside a laptop, with test equipment connected" loading="lazy" />
  <figcaption>My substitute for a helping-hands stand: a mug. It kept the camera steady while I worked.</figcaption>
</figure>

## Starting with OSINT and a screwdriver

Before opening anything, I looked up the model number and FCC ID. Regulatory listings turned out to be useful because they included internal photos of the camera, not just product shots. I could see the main board, the image-sensor board, the Wi-Fi antenna connection, the Ethernet hardware, and the flash chip before I had even removed a screw.

The screws were hiding under the rubber pads on the base. Once the pads came off, the housing opened and the green main board was finally visible. The camera had more than one board because the image sensor and moving camera assembly need their own compact board, while the larger board handles the processor, Wi-Fi, Ethernet, storage, power, speaker, and the exposed debug connections.

The first things I looked for were chip markings, connectors, and labels printed directly on the board. The guide had told me to look for UART, flash, JTAG, SD-card slots, USB, and Ethernet. In this camera, the UART header was literally labelled, which saved me from guessing where it was.

## Finding the UART pins

Inside the camera I found four holes labelled `G`, `R`, `T` and `V`. They are for **UART**, a simple serial connection that lets the camera send boot messages and accept typed commands. `G` is ground, `T` sends data from the camera, and `R` receives data. I left `V` alone because the camera already had its own power supply.

Even though the header was labelled, I still checked the ground pin with my multimeter. I put the black probe on the metal SD-card shield and touched the red probe to each header hole in continuity mode. When the meter beeped at `G`, it meant there was a direct electrical path between that hole and the shield. The shield is connected to the board's ground plane, so the beep confirmed that `G` really was ground.

The black and red probes are just the meter's reference points. In continuity mode, they are not supplying power; the meter sends a tiny test signal and beeps when it sees a very low-resistance path. Finding ground matters because the USB serial adapter and camera need the same electrical reference before they can understand each other's signals.

The holes were too small for my normal jumper pins. I only had two test probes, but needed three connections. For the last one, I removed the metal pin from a jumper wire, exposed the conductor, and held it in place with Blu Tack. It was not a proper long-term connection. In fact, loose contacts became one of my biggest troubleshooting problems. I checked the wiring carefully so neighbouring points would not touch.

<figure class="project-evidence">
  <img src="/personal_blog/images/dlink-camera/improvised-uart-wire.png" alt="A thin jumper wire with its metal pin removed and conductor exposed" loading="lazy" />
  <figcaption>The improvised third connection: a bare conductor after removing the jumper pin.</figcaption>
</figure>

<figure class="project-evidence">
  <img src="/personal_blog/images/dlink-camera/uart-wires-on-board.png" alt="Test probes and wires attached to the opened camera's circuit board" loading="lazy" />
  <figcaption>Probes and the improvised wire on the camera board. The Blu Tack helped keep a fragile contact in place.</figcaption>
</figure>

I used a USB serial adapter and Kali Linux to read the connection at **57,600 baud**—the speed at which the camera sends its serial messages. At first the screen was blank. The adapter changed from `/dev/ttyUSB0` to `/dev/ttyUSB1` after I reconnected it, and I also had to sort out loose contacts and an old `minicom` session still holding the port. Once the wires stayed put and I restarted the camera, the boot messages appeared.

```bash
ls /dev/ttyUSB*
sudo minicom -o -D /dev/ttyUSB1 -b 57600 -8
```

<figure class="project-evidence project-evidence--terminal">
  <img src="/personal_blog/images/dlink-camera/uart-console-noise.png" alt="Real Kali serial-console screenshot showing repeated startup messages and a login prompt" loading="lazy" />
  <figcaption>A real screenshot from the serial session. The messages kept interrupting the login prompt.</figcaption>
</figure>

The screen was noisy because the camera printed status messages repeatedly. I had disconnected another camera board during part of the experiment, so it also complained that the video device was missing. That was the camera reacting to my stripped-down test setup.

## Reaching the camera's Linux shell

Once I could type at the login prompt, the camera accepted its local `admin` account without a password and gave me a `#` prompt. That prompt alone was not enough to prove what access I had, so I checked the process's user ID. It was `0`: the Linux administrator, usually called **root**.

```sh
# id
uid=0(root) gid=0(root)

# cat /proc/mtd
mtd0: 00800000 00010000 "ALL"
mtd1: 00030000 00010000 "Bootloader"
mtd2: 00010000 00010000 "Config"
mtd3: 00010000 00010000 "Factory"
mtd4: 007b0000 00010000 "Kernel"
```

<figure class="project-evidence project-evidence--terminal project-evidence--crop-top">
  <img src="/personal_blog/images/dlink-camera/uart-root-proof.png" alt="Real serial-console screenshot showing Uid 0 and Gid 0 in the camera shell" loading="lazy" />
  <figcaption>The real console output showed user and group ID 0, confirming root-level local access.</figcaption>
</figure>

Getting a root shell made the rest of the investigation much easier. I could look at the running system directly instead of treating the camera as a black box.

## Reading the chip that stores the software

The small eight-legged chip marked `U7` is a Macronix **MX25L6433F**, an 8 MB flash-memory chip. Think of it as the camera's built-in storage: it contains the startup program, settings and Linux software. I used a CH341A reader and a clip to copy it while the camera was **unpowered**.

<figure class="project-evidence">
  <img src="/personal_blog/images/dlink-camera/flash-chip-closeup.png" alt="Close-up of the eight-pin Macronix memory chip marked U7 on the camera board" loading="lazy" />
  <figcaption>The flash chip on my actual board. Its marking was more useful than relying only on older regulatory photographs.</figcaption>
</figure>

The first attempt did not detect a chip. I reseated the clip and checked the connection rather than writing anything to the board. After that, I read the chip **twice**. Both copies were exactly 8,388,608 bytes and had the same SHA-256 fingerprint, which gave me confidence that the read was repeatable.

<figure class="project-evidence project-evidence--terminal project-evidence--crop-top">
  <img src="/personal_blog/images/dlink-camera/flash-read-first-attempt.png" alt="Real Kali screenshot showing an initial flashrom attempt and device-detection troubleshooting" loading="lazy" />
  <figcaption>The first chip-detection attempt failed. Keeping this screenshot tells the troubleshooting story more honestly than showing only the successful result.</figcaption>
</figure>

Here is the command sequence I used to make two copies and compare them:

```bash
sudo flashrom -p ch341a_spi -r dlink-dump1.bin
sudo flashrom -p ch341a_spi -r dlink-dump2.bin
wc -c dlink-dump1.bin dlink-dump2.bin
sha256sum dlink-dump1.bin dlink-dump2.bin
```

The output showed two 8 MB files with the same fingerprint:

```text
8388608 dlink-dump1.bin
8388608 dlink-dump2.bin

9f8dc542f7cc10ebf4d888042e150b6d8c75bfd2796a75f05f7be779481a276a  dlink-dump1.bin
9f8dc542f7cc10ebf4d888042e150b6d8c75bfd2796a75f05f7be779481a276a  dlink-dump2.bin
```

## Unpacking the firmware

The `.bin` file was a raw copy of the flash chip rather than a neat folder full of files. I used `binwalk` to search the copy for familiar file signatures:

```bash
binwalk dlink-dump1.bin
```

It found a U-Boot bootloader, a Linux kernel image for a MIPS processor, and LZMA-compressed data. That was the first clue that the dump contained several layers packed together.

```text
0x143B0  U-Boot 1.1.3
0x50000  Linux kernel image
0x50040  LZMA compressed data
```

I used a short Python script to copy the relevant byte range from the dump and decompress the LZMA data. I did not need to understand the camera's compiled code for this part; the script was doing file handling: open the dump, start at the offset Binwalk found, save that section, and unpack it.

The decompressed kernel still contained another layer. I initially went looking for SquashFS because that is common in embedded devices, but `file` and `binwalk` pointed elsewhere. The filesystem turned out to be a CPIO archive, so I extracted it with:

```bash
rootfs_dir=$(mktemp -d "$PWD/rootfs.XXXXXX")
cpio -idm --no-absolute-filenames --no-preserve-owner -D "$rootfs_dir" < rootfs-candidate.bin
```

That gave me a normal-looking Linux filesystem with folders such as `bin`, `etc_ro`, `sbin`, `usr`, and `mydlink`. The many `Cannot mknod` warnings came from special device entries under `/dev`; they did not stop the normal files from being extracted.

I then searched the extracted files for the serial login and password-handling code:

```bash
grep -rInI -E 'ttyS1|/bin/login|passwd|chpasswd|telnetd' etc_ro sbin 2>/dev/null
```

That led to the startup configuration and shell scripts that set up the camera's local account at boot. It also explained why the live camera showed a login prompt on the UART connection.

<figure class="project-evidence project-evidence--terminal project-evidence--crop-bottom">
  <img src="/personal_blog/images/dlink-camera/extracted-filesystem.png" alt="Real Kali screenshot showing extracted camera firmware folders such as bin, etc_ro and mydlink" loading="lazy" />
  <figcaption>The extracted firmware folders. The warnings above them came from Linux device files that my ordinary Kali account could not recreate.</figcaption>
</figure>

I kept the full memory copy in my local lab archive and worked from extracted files during the analysis.

## Checking the camera over Ethernet

I also connected the camera directly to my laptop with a USB Ethernet adapter. Its older web page warned that modern browsers might have trouble with video. That was frustrating, but the camera still answered simple web requests, so the phone app was not needed for every test.

<figure class="project-evidence project-evidence--terminal">
  <img src="/personal_blog/images/dlink-camera/legacy-browser-warning.png" alt="Camera web page warning that modern browsers may struggle with video" loading="lazy" />
  <figcaption>The old browser warning that sent me looking at what the camera actually served over the network.</figcaption>
</figure>

One information page, `/common/info.cgi`, responded without a login. It revealed the model, software version and some network settings. The main page and image endpoint asked for authentication. The video endpoint asked for **Basic authentication over ordinary HTTP**; that is an older method where credentials are not encrypted by HTTP itself.

From the camera's own shell I also saw its web service listening on ports 80 and 443. This was the command I used to see which processes had open network ports:

```sh
# netstat -lntp
tcp  0  0  0.0.0.0:80   0.0.0.0:*  LISTEN  240/alphapd
tcp  0  0  0.0.0.0:443  0.0.0.0:*  LISTEN  240/alphapd
```

<figure class="project-evidence project-evidence--terminal">
  <img src="/personal_blog/images/dlink-camera/camera-listening-services.png" alt="Real camera shell screenshot listing web services on ports 80 and 443" loading="lazy" />
  <figcaption>The camera's own list of listening network services.</figcaption>
</figure>

The camera reported software version **1.06.02**. [D-Link's notes for version 1.07.02](https://support.dlink.com/resource/products/DCS-5030L/REVA/DCS-5030L_REVA_RELEASE_NOTES_v1.07.02.pdf) say that a later release reduced the information returned by `/common/info.cgi`, changed the older video-login method, and tightened TLS support. That lined up neatly with what I saw on the device.

## What I learned

The most memorable part was not a clever command. It was discovering how much the *physical connection* matters: tiny holes, unstable wires, a camera balanced in a mug, and a chip clip that needed reseating. Once the connection was reliable, the software side became much easier to reason about.

I came away with three concrete results: a root-level local shell, two matching reads of the camera's flash memory, and a clearer map of its network behaviour. Just as important, I learned that the least glamorous parts—getting a solid connection, checking a read twice, and following the evidence—are what make the interesting parts possible.
