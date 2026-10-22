---
project: iot-physical-security-challenge
---

I’m an electrical and electronics engineering undergrad. I chose my degree before I got interested in cybersecurity, and for a while I treated some of my non-cyber modules like a detour. Then I started wondering how I could connect digital electronics and analog electronics to security work. IoT security kept coming up, so I decided to try it for myself. I think I’m hooked.

After reading about IoT security and watching hours of YouTube videos, I wanted to stop just watching and start poking around myself. I didn’t want to pick a device because someone had already posted a vulnerability or follow a tutorial step by step. I wanted to buy something cheap and figure out what I could learn from it, so I found a used camera on Carousell for S$10 and ordered a few hardware tools from Shopee.

<figure class="project-evidence">
  <img src="/personal_blog/images/dlink-camera/carousell-listing.jpg" alt="Original Carousell listing for the used D-Link camera and its accessories, priced at S$10" loading="lazy" />
  <figcaption>The listing that started it: a used camera and its accessories for S$10.</figcaption>
</figure>

I still wanted a general method to follow, so I used the [Embedded Device Hacking guide](https://www.iotpentestingguide.com/chapter1.html) as a loose map. It suggests starting with research and a visual inspection, then opening the device, finding its interfaces, and looking at its firmware. That gave me a direction while leaving room to work things out as I went.

## Starting with OSINT and a screwdriver

After inspecting the camera, I identified it as a D-Link DCS-5030L. Before opening it, I looked up the model number and FCC ID. The regulatory listings had internal photos, so I could see the main board, image-sensor board, Wi-Fi antenna connection, Ethernet hardware, and flash chip before I had removed a screw.

The screws were hiding under the rubber pads on the base. Once the pads came off, the housing opened and the green main board was finally visible. The camera had more than one board because the image sensor and moving camera assembly need their own compact board, while the larger board handles the processor, Wi-Fi, Ethernet, storage, power, speaker, and the exposed debug connections.

The first things I looked for were chip markings, connectors, and labels printed directly on the board. The guide had told me to look for UART, flash, JTAG, SD-card slots, USB, and Ethernet. In this camera, the UART header was literally labelled, which saved me from guessing where it was.

## UART

Inside the camera I found four holes labelled `G`, `R`, `T` and `V`. They are for **UART**, a simple serial connection that lets the camera send boot messages and accept typed commands. `G` is ground, `T` sends data from the camera, and `R` receives data. I left `V` alone because the camera already had its own power supply.

Even though the header was labelled, I still checked the ground pin with my multimeter. I put the black probe on the metal SD-card shield and touched the red probe to each header hole in continuity mode. When the meter beeped at `G`, it meant there was a direct electrical path between that hole and the shield. The shield is connected to the board's ground plane, so the beep confirmed that `G` really was ground.

The black and red probes are just the meter's reference points. In continuity mode, they are not supplying power; the meter sends a tiny test signal and beeps when it sees a very low-resistance path. Finding ground matters because the USB serial adapter and camera need the same electrical reference before they can understand each other's signals.

**Problem #1:** The holes were too small for my normal jumper pins, and I only had two test probes but needed three connections. For the last one, I cut the metal pin off a jumper wire, exposed the conductor, and held it in place with Blu Tack. Genius idea at first; loose contacts became one of my biggest troubleshooting problems later.

**Problem #2:** I couldn’t remove the main board fully because it was held in by hot glue. I had to wire it up while it was still sitting in the camera enclosure, and I didn’t have helping-hand tools. So I put the whole thing in a mug to keep it steady. Somehow, that worked.

<figure class="project-evidence">
  <img src="/personal_blog/images/dlink-camera/uart-wires-on-board.png" alt="Test probes and wires attached to the opened camera's circuit board" loading="lazy" />
  <figcaption>Probes and the improvised wire on the camera board. The Blu Tack helped keep a fragile contact in place.</figcaption>
</figure>

<figure class="project-evidence">
  <img src="/personal_blog/images/dlink-camera/camera-in-mug-setup.png" alt="Open D-Link camera balanced in a mug beside a laptop, with test equipment connected" loading="lazy" />
  <figcaption>No helping hands, so the mug became my camera stand.</figcaption>
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

This was the point where I started using Python. Binwalk gave me the byte offset where the compressed data began. My script opened the dump, sliced out the LZMA section, decompressed it, and saved the result so I could inspect it. The core idea looked like this:

```python
from pathlib import Path
import lzma

dump = Path("dlink-dump1.bin").read_bytes()
offset = 0x50040  # LZMA data offset reported by Binwalk
compressed_size = 7_734_984  # image size from the uImage header
compressed = dump[offset:offset + compressed_size]

kernel = lzma.decompress(compressed, format=lzma.FORMAT_ALONE)
Path("kernel-decompressed.bin").write_bytes(kernel)
print(f"Decompressed {len(kernel):,} bytes")
```

The part that took me a moment to understand was the offset: it is just the number of bytes to skip from the start of the dump before the compressed section begins. The script turns that section into a file I could keep examining with other tools.

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

IoT hacking is damn fun, but ragebait at times. There are so many variables and things to trouble shoot when it comes to anything hardware related. Sometimes you just have to run stuff twice also. I think i will try a router next ...
