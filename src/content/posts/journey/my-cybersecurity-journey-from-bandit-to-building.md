---
title: "My Cybersecurity Journey: From Bandit to Building"
description: "How rebuilding the fundamentals changed my approach to security, and why teaching and challenge creation became part of learning."
publishedDate: 2026-07-28
updatedDate: 2026-07-29
category: journey
tags:
  - linux
  - networking
  - ctf
  - challenge-creation
  - teaching
  - leadership
graphTopics:
  - systems
featured: true
draft: false
---

I did not begin cybersecurity with a carefully designed roadmap. My first formal exposure came through EE5084 Cybersecurity during GEM Trailblazer, before I entered NTU. The subject was interesting, but interest had not yet become direction. I had seen part of the field without building the habits that would let me work through it independently.

The more useful beginning came later, when I stopped treating cybersecurity as a collection of impressive outcomes and started treating it as a long sequence of foundations, corrections and small projects.

## 25 June 2025: starting with Linux

On **25 June 2025**, I started OverTheWire Bandit. Bandit gave me a concrete reason to use Linux instead of only reading about it. Each level was small, but it forced me to become less hesitant around the shell: navigating files, reading documentation, inspecting permissions, connecting to services and understanding why a command behaved differently from what I expected.

That work was basic, and that was exactly the point. Security tools make more sense when the operating system beneath them is not completely opaque.

I continued through beginner material on HTB Academy, where I started learning the shape of a penetration-testing process. What stayed with me was the importance of method. Enumeration was not simply a command to run at the beginning; it was a way of reducing assumptions. Findings needed evidence. Exploitation needed context. Notes needed to be useful after the terminal window was closed.

On **5 July 2025**, I attended the NUS GreyCTF Summit. I also used TryHackMe Premium and attended an NTU cybersecurity community meetup on **13 August 2025**. These gave me more examples of what people in the field built and studied. They did not immediately make me capable of doing the same work, but they made the field feel less abstract.

At this stage, I was mainly consuming learning paths and solving guided problems. That was useful, but it also made it easy to confuse recognition with understanding. Seeing a technique before does not mean I can choose it from first principles.

## 4 January 2026: admitting that the network mattered

When I returned more seriously in January 2026, I noticed a weakness that affected almost everything else: my networking foundations were not reliable enough.

It is possible to follow a web-security walkthrough while holding only a rough picture of the traffic. It is also possible to memorise common ports, scans and headers. But as soon as a lab behaves differently, that knowledge becomes fragile. I found myself wanting a clearer answer to basic questions about how systems addressed each other, how packets moved and where protocols sat in the exchange.

On **4 January 2026**, I began rebuilding those foundations through Cisco Academy. Going back was uncomfortable mainly because the material looked less exciting than the security topics I wanted to reach. It turned out to be one of the most practical corrections I could make.

The benefit was not a sudden jump in skill. It was a gradual reduction in guesswork. Web requests, service enumeration and network diagrams became easier to reason about when I was not trying to hold them together through memorised fragments.

> A weak foundation does not always stop progress immediately. Sometimes it makes every later step slightly more confusing, which is harder to notice.

## Entering the community as a contributor

During the same period, my relationship with the cybersecurity community began to change. I was no longer only looking for events to attend. I was beginning to ask what I could help create.

On **11 January 2026**, I presented an early SentCTF concept at a Sentinels retreat. The idea was still early, but presenting it required a different kind of thinking from solving an existing task. A challenge needs a learning objective, an intended path and enough structure that another person can understand what the creator meant.

On **19 March 2026**, I led a beginner cybersecurity event and taught OSINT. Preparing for beginners exposed gaps that completing a room or challenge had not exposed. I had to decide what background knowledge I could assume. I had to explain why a technique worked, not only demonstrate that it returned a result. I also had to make ethical boundaries explicit because open-source information is still information about people.

Teaching did not prove that I had mastered OSINT. It showed me how much care a clear introduction requires. It also made me more conscious of the distance between knowing the name of a tool and understanding a repeatable investigative method.

## March to April 2026: building NTU Rewind

During March and April, I created and documented **NTU Rewind**, an OSINT CTF challenge based on NTU history. The challenge used public archival and location-based sources.

This was an early milestone in moving from solving to creating. As a solver, I could focus on reaching the answer. As a creator, I needed to think about the experience surrounding the answer:

- Does each clue move the solver forward?
- Is the intended source public and stable?
- Could an unintended route disclose something that should remain private?
- Is the difficulty caused by useful reasoning or merely by ambiguity?
- Will the challenge still work when somebody else attempts it?

Documentation became part of the build rather than an activity left until the end. A challenge that works only while its creator remembers every assumption is not yet reliable.

I am intentionally not publishing the complete solution here. Creating a public project record does not require releasing every operational detail, especially when a challenge has not been explicitly released for that purpose.

## May to June 2026: widening the practice

In May 2026, I expanded my web-security study through PortSwigger Web Security Academy. I was becoming more comfortable with Burp-based manual testing and with separating the observed request from the theory I had about it.

I also continued building pentesting notes and learning SOC concepts. These two directions use different perspectives, but studying both helped me see why evidence and chronology matter. The same event can be approached as something to test, something to detect or something to explain later.

Competitions gave me opportunities to apply the material under time constraints. In **June 2026**, I qualified for the TISC and CDDC finals. I value those results as markers of progress, but I do not treat them as proof that the underlying subjects are complete. A competition result records what happened within a particular format; it does not remove the gaps that appear in a different environment.

From **8 June to 10 July 2026**, I took part in an authorised YesWeHack bug bounty programme. The word *authorised* is important. The work had a defined scope and required a responsible workflow.

That changed how I thought about testing. A lab is designed to be attacked. A real programme requires constant attention to what is allowed, what evidence is necessary and what impact must be avoided. A technically interesting test is not automatically a responsible one. Good notes, scope checks and restraint are part of the work.

I am not publishing target details, findings or private programme information. The durable lesson is about process: verify scope, minimise impact, retain clear evidence and report through the correct channel.

## June to July 2026: responsibility beyond the challenge

My responsibilities within NTU Sentinels grew through June and July. I began coordinating more technical contributors, supporting educational opportunities and taking on larger community-building responsibilities.

Leadership in a university cybersecurity community is partly technical, but not only technical. Events involve privacy, governance, participant trust and sponsor responsibility. Challenges need to be safe. Public descriptions need to leave private information out. Technical enthusiasm does not override those constraints.

This period also brought me closer to physical, IoT and hardware challenge development. A challenge involving a real device adds failure modes that do not exist in a purely software task. Hardware can become unavailable. Networks need to be isolated. Credentials and firmware cannot be treated casually. A physical interaction can have consequences beyond resetting a virtual machine.

The work has made me more interested in how reliable challenge infrastructure is designed, but it has also made me slower to claim that an idea is ready.

## July 2026: going lower in the stack

In July, I began deeper study of Linux program loading, ELF files, assembly, IoT and hardware security. Reverse engineering and binary exploitation are areas where I am still building foundations.

Going lower in the stack has been valuable because it exposes assumptions hidden by higher-level tools. A program is not simply a file that “runs”. The loader, memory layout, linking, permissions and machine instructions all shape what actually happens.

It has also been humbling. Familiarity with Linux commands does not translate automatically into understanding an ELF binary. Web-security experience does not replace the need to reason about registers and memory. Progress in one part of cybersecurity does not collapse the learning curve in another.

That is why I want to document these subjects while learning them. A beginner’s explanation can be useful if it is careful about its limits, shows what was verified and is willing to be corrected.

## What changed

The clearest change since June 2025 is not the number of platforms, events or competitions I can list. It is the way I approach unfamiliar work.

I am more likely to return to a prerequisite instead of trying to route around it. I take notes with the expectation that another person—or my future self—should be able to follow them. I think more about scope and impact. I ask what a challenge teaches, not only whether it can be solved.

Moving into teaching and challenge creation also changed the standard I apply to my own understanding. If I cannot explain the assumptions, I probably do not understand the technique as well as I think. If a challenge depends on accidental ambiguity, it probably needs more design. If a test cannot be justified inside the authorised scope, it should not be run.

## Current focus

The areas where I am developing the most confidence are:

- Linux and networking fundamentals
- Web and API security
- OSINT
- Burp-based manual testing
- Enumeration and exploitation methodology
- Responsible bug bounty workflow
- Beginner teaching
- CTF challenge creation
- Technical community leadership

The areas I am deliberately improving include reverse engineering, binary exploitation, memory forensics, Active Directory, mobile security, advanced API testing, firmware and hardware security, technical writing and AI security.

That second list is not a backlog I expect to finish quickly. It is a reminder to keep claims smaller than the work required to support them.

I started with Bandit because I needed a practical way into Linux. A year later, I am still working on foundations—just at different layers, and with more responsibility for what I build around them. This site is where I intend to keep that process visible.
