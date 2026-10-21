---
project: iot-physical-security-challenge
---

I wanted to understand what happens *inside* a security camera, beyond the phone app and web page. So I opened a D-Link DCS-5030L that I own and followed three routes into it: the small serial connection on its circuit board, the chip that stores its software, and its Ethernet connection.

This was a learning project on my own device. I did not find a new zero-day, and I did not test other people's cameras. What I did get was a much clearer picture of how hardware, software and the network fit together.

<figure class="project-evidence">
  <img src="/personal_blog/images/dlink-camera/camera-in-mug-setup.png" alt="Open D-Link camera balanced in a mug beside a laptop, with test equipment connected" loading="lazy" />
  <figcaption>My substitute for a helping-hands stand: a mug. It kept the camera steady while I worked.</figcaption>
</figure>

## First problem: connecting to tiny holes

Inside the camera I found four holes labelled `G`, `R`, `T` and `V`. They are for **UART**, a simple serial connection that can carry messages from the camera to a computer. `G` is ground, `T` sends data from the camera, and `R` receives data. I left `V` alone; the camera had its own power supply.

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

<figure class="project-evidence project-evidence--terminal">
  <img src="/personal_blog/images/dlink-camera/uart-console-noise.png" alt="Real Kali serial-console screenshot showing repeated startup messages and a login prompt" loading="lazy" />
  <figcaption>A real screenshot from the serial session. The messages kept interrupting the login prompt.</figcaption>
</figure>

The screen was noisy because the camera printed status messages repeatedly. I had disconnected another camera board during part of the experiment, so it also complained that the video device was missing. That was a consequence of my test setup, **not** a vulnerability I discovered.

## Reaching the camera's Linux shell

Once I could type at the login prompt, the camera accepted its local `admin` account without a password and gave me a `#` prompt. That prompt alone was not enough to prove what access I had, so I checked the process's user ID. It was `0`: the Linux administrator, usually called **root**.

<figure class="project-evidence project-evidence--terminal project-evidence--crop-top">
  <img src="/personal_blog/images/dlink-camera/uart-root-proof.png" alt="Real serial-console screenshot showing Uid 0 and Gid 0 in the camera shell" loading="lazy" />
  <figcaption>The real console output showed user and group ID 0, confirming root-level local access.</figcaption>
</figure>

This was a **physical-access** finding: someone would need to open the camera and connect to its board. It does not mean I found a way to log in remotely without a password. I later found a [public presentation about this same camera](https://www.osdfcon.org/presentations/2020/Joe-McCormack_Austin-Grupposo_Linux-Forensics-IOT.pdf) that had already documented its UART access and blank-password root shell. My result is an independent reproduction, not a new discovery.

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

I missed taking a screenshot of the final matching-hash command. The following is a **reconstructed text excerpt from the output I saved**, not a photograph or a claim that I captured it on screen at the time:

```text
$ wc -c dlink-dump1.bin dlink-dump2.bin
 8388608 dlink-dump1.bin
 8388608 dlink-dump2.bin

$ sha256sum dlink-dump1.bin dlink-dump2.bin
9f8dc542f7cc10ebf4d888042e150b6d8c75bfd2796a75f05f7be779481a276a  dlink-dump1.bin
9f8dc542f7cc10ebf4d888042e150b6d8c75bfd2796a75f05f7be779481a276a  dlink-dump2.bin
```

I used `binwalk` to look for recognizable pieces inside the copy. It found a bootloader and a compressed Linux image. Extracting it took more steps than I expected: the files were packed as a **CPIO archive**, not the SquashFS format I had first looked for. I could then inspect the camera's startup scripts and see how its local login account was created.

<figure class="project-evidence project-evidence--terminal project-evidence--crop-bottom">
  <img src="/personal_blog/images/dlink-camera/extracted-filesystem.png" alt="Real Kali screenshot showing extracted camera firmware folders such as bin, etc_ro and mydlink" loading="lazy" />
  <figcaption>The extracted firmware folders. The warnings above them came from Linux device files that my ordinary Kali account could not recreate.</figcaption>
</figure>

I am **not** publishing the full memory copy. It contains saved settings and other material that should stay private.

## Checking the camera over Ethernet

I also connected the camera directly to my laptop with a USB Ethernet adapter. Its older web page warned that modern browsers might have trouble with video. That was frustrating, but the camera still answered simple web requests, so the phone app was not needed for every test.

<figure class="project-evidence project-evidence--terminal">
  <img src="/personal_blog/images/dlink-camera/legacy-browser-warning.png" alt="Camera web page warning that modern browsers may struggle with video" loading="lazy" />
  <figcaption>The old browser warning that sent me looking at what the camera actually served over the network.</figcaption>
</figure>

One information page, `/common/info.cgi`, responded without a login. It revealed the model, software version and some network settings—but not the administrator password. The main page and image endpoint asked for authentication. The video endpoint asked for **Basic authentication over ordinary HTTP**; that is an older method where credentials are not encrypted by HTTP itself. I did not demonstrate an authentication bypass.

From the camera's own shell I also saw its web service listening on ports 80 and 443. I checked those observations against the direct Ethernet connection rather than treating every running program as a remotely reachable vulnerability.

<figure class="project-evidence project-evidence--terminal">
  <img src="/personal_blog/images/dlink-camera/camera-listening-services.png" alt="Real camera shell screenshot listing web services on ports 80 and 443" loading="lazy" />
  <figcaption>The camera's own list of listening network services.</figcaption>
</figure>

The camera reported software version **1.06.02**. [D-Link's notes for version 1.07.02](https://support.dlink.com/resource/products/DCS-5030L/REVA/DCS-5030L_REVA_RELEASE_NOTES_v1.07.02.pdf) say that later release reduced the information returned by `/common/info.cgi`, changed the older video-login method, and tightened TLS support. Those notes help explain my observations. They do not turn this project into a new CVE.

## What I learned

The most memorable part was not a clever command. It was discovering how much the *physical connection* matters: tiny holes, unstable wires, a camera balanced in a mug, and a chip clip that needed reseating. Once the connection was reliable, the software side became much easier to reason about.

I came away with three concrete results: I reproduced previously documented local root access, made two matching reads of the camera's flash memory, and mapped a few network behaviours against the vendor's later fixes. Just as important, I learned to separate **what I observed** from **what I suspect**—and to say clearly when someone else had found the same issue first.
