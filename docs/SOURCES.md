# ASN.1-only source mapping

Primary source: the supplied `computer-networks-a-top-down-approach-9781259001567-1259001563_compress-750-758.pdf`.

| Slides | Basis |
| --- | --- |
| 1–5 | Section 9.3 introduction, p. 722. Expanded student-record analogy and explanation of abstract syntax. |
| 6 | Table 9.5, p. 722: symbols. |
| 7 | Table 9.6, p. 723 and naming rules, pp. 724–725. Original module wrapper. |
| 8 | Table 9.7, pp. 723–724: built-in types. |
| 9 | Example 9.6, p. 724: new types. Explicit enumeration numbers added. |
| 10 | Example 9.7, p. 724: subtype constraints. |
| 11 | Example 9.8 and assignment syntax, p. 725. |
| 12 | StudentAccount, pp. 725–726; figure 9.23. Missing ::= restored in value assignment. |
| 13 | SEQUENCE OF discussion, p. 726; simplified forwarding-table record example. |
| 14 | Table 9.6, p. 723; original CHOICE example and precise SET/SET OF distinction. |
| 15 | Section 9.3.3, p. 726: definition, assignment, then encoding. No separate BER lesson. |
| 16 | Recap of section 9.3, pp. 722–726. |
| 17 | P9-17, p. 730: ASN.1 GetRequest definition. |
| 18 | P9-18, p. 730: ASN.1 Response definition. |
| 19 | P9-20, p. 730: ASN.1 message definition. |
| 20 | P9-21, p. 730: ASN.1 VarBindList definition. |

## Answer appendix scope

Only P9-17, P9-18, P9-20 and P9-21 explicitly request ASN.1 definitions. Those four are answered at the end. Other chapter questions, general network-management exercises, BER calculation problems, and the original custom quiz are excluded.

The questions reference figures 9.18 and 9.19, which are outside the supplied PDF excerpt. Consequently, the answer field layouts are supplemented from [RFC 1157, section 5](https://www.rfc-editor.org/rfc/rfc1157) and its imported types from [RFC 1155](https://www.rfc-editor.org/rfc/rfc1155).

The answers present community-based SNMPv1 structures as ASN.1 exercises. P9-20 reuses the standard `PDUs` CHOICE type through IMPORTS; this is a typed specialization of the standard's `ANY` payload for the normal PDU case, not a definition of the different SNMPv3 message envelope. Request/response examples use INTEGER directly for readability; the standard also supplies named integer values for error status. VarBindList repeats VarBind records and preserves the standard's ObjectSyntax type through an import.

ASN.1 notation reference: [ITU-T X.680](https://www.itu.int/rec/T-REC-X.680).

The textbook's familiar word “variable” is explained as an ASN.1 value assignment. An OBJECT IDENTIFIER is an ordered sequence of non-negative integer arcs. SET OF repeats one type without semantic ordering. The sample credentials are reproduced only to explain figure 9.23.

Design inspiration remains [NET-SEAL](https://net-seal.github.io/) and [NetViz](https://dpnkrpl.github.io/netviz/), for visual explanations and experiments. No reference-site code or images were copied.
