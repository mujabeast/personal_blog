---
title: Understanding Linux Program Loading as a Beginner
description: A planned beginner’s map of ELF files, the loader, memory and the assumptions hidden behind running a program.
publishedDate: 2026-07-17
category: learning
tags: [linux, elf, reverse-engineering, binary-exploitation]
featured: false
draft: true
---

Typing `./program` hides a long chain of decisions. This article will document my current understanding of that chain, with small verified experiments and clear TODOs where the model is incomplete.

## From pathname to process

- TODO: Verify the system-call path used in the demonstration.
- Distinguish shell behaviour from kernel behaviour.

## Reading an ELF header

- File class, architecture, entry point and program headers.
- TODO: Add reproducible `readelf` output from a harmless sample.

## Mapping segments

- File offsets, virtual addresses and permissions.
- TODO: Verify the example with `/proc/<pid>/maps`.

## Dynamic linking

- Interpreter and shared libraries.
- TODO: Explain relocation only after a verified experiment.

## Mistakes in my first mental model

- TODO: Record actual misconceptions rather than inventing them.

## Ethical and scope boundary

- Use only self-built binaries or intentionally provided learning targets.
