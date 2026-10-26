window.AXIS_DATA = {
  "case": [
    "The Company: \"Momentum Dynamics\" is a leading automotive technology company on the verge of releasing its flagship product, \"AXIS,\" a Level 4 autonomous driving system. The system is designed to handle all driving functions in specific, pre-mapped urban environments. The company has invested billions of dollars and years of research into AXIS, and its market valuation is heavily dependent on a successful and timely launch.",
    "The Engineer: You are Lena, a senior software engineer and the lead for the perception team. Your team is responsible for the AI models that identify and classify objects from sensor data (cameras, LiDAR, radar), such as pedestrians, cyclists, other vehicles, and road signs.",
    "The Discovery: Two weeks before the final software version is due to be locked for production, Lena is running a series of last-minute, high-stress regression tests. During a test specifically designed to simulate adverse weather conditions, she discovers a critical flaw. In heavy rain, particularly at dusk or dawn, the system's primary camera-based object detection model has a statistically significant (5-7%) higher rate of misclassifying pedestrians wearing dark clothing as static, non-hazardous objects (like a mailbox or a shadow).",
    "While the system has redundancies (LiDAR and radar), these sensors also have their performance degraded, albeit differently, by heavy rain. The sensor fusion algorithm, which combines the data, tends to \"trust\" the high-resolution camera data. In Lena's simulations, this specific combination of factors leads to a failure-to-brake event in 1 out of approximately 1,000 instances, which is a rate she deems unacceptably high.",
    "The Pressure: Lena immediately brings her findings to her project manager, David. David is concerned but points out that the launch date is non-negotiable. The marketing campaign has already begun, and a delay would cost the company hundreds of millions of dollars and could cede the market to a competitor. He argues that the conditions for the failure are rare (heavy rain + low light + pedestrian in dark clothing) and that the overall safety statistics of the AXIS system are still vastly superior to human drivers. He suggests they \"log the issue, address it in the first over-the-air update a month or two after launch, and proceed as planned.\" He reminds Lena that the entire team's end-of-year bonuses are tied to a successful, on-time launch."
  ],
  "clauses": [
    {
      "id": "1",
      "title": "Public safety, welfare and privacy",
      "text": "to hold paramount, the safety, health, and welfare of the public, to strive to comply with ethical design and sustainable development practices, to protect the privacy of others, and to disclose promptly factors that might endanger the public or the environment;"
    },
    {
      "id": "2",
      "title": "Understanding technology and its implications",
      "text": "to improve the understanding by individuals and society of the capabilities and societal implications of conventional and emerging technologies, including intelligent systems;"
    },
    {
      "id": "3",
      "title": "Conflicts of interest",
      "text": "to avoid real or perceived conflicts of interest whenever possible, and to disclose them to affected parties when they do exist;"
    },
    {
      "id": "4",
      "title": "Lawful conduct and rejecting bribery",
      "text": "to avoid unlawful conduct in professional activities, and to reject bribery in all its forms;"
    },
    {
      "id": "5",
      "title": "Honest criticism, correction and reporting",
      "text": "to seek, accept, and offer honest criticism of technical work, to acknowledge and correct errors, to be honest, and realistic in stating claims or estimates based on available data, and to credit properly the contributions of others;"
    },
    {
      "id": "6",
      "title": "Technical competence and limitations",
      "text": "to maintain and improve our technical competence and to undertake technological tasks for others only if qualified by training or experience, or after full disclosure of pertinent limitations;"
    },
    {
      "id": "7",
      "title": "Fair treatment and nondiscrimination",
      "text": "to treat all persons fairly and with respect, and to not engage in discrimination based on characteristics such as race, religion, gender, disability, age, national origin, sexual orientation, gender identity, or gender expression;"
    },
    {
      "id": "8",
      "title": "No harassment or bullying",
      "text": "to not engage in harassment of any kind, including sexual harassment or bullying behavior;"
    },
    {
      "id": "9",
      "title": "Avoiding false or malicious harm",
      "text": "to avoid injuring others, their property, reputation, or employment by false or malicious actions, rumors, or any other verbal or physical abuses;"
    },
    {
      "id": "10",
      "title": "Supporting ethical conduct and non-retaliation",
      "text": "to support colleagues and co-workers in following this code of ethics, to strive to ensure the code is upheld, and to not retaliate against individuals reporting a violation."
    }
  ],
  "options": [
    {
      "id": "launch",
      "title": "Proceed with the planned launch",
      "text": "Log the issue and plan an over-the-air fix after release."
    },
    {
      "id": "escalate",
      "title": "Escalate internally and request a delay",
      "text": "Document the evidence and seek review by senior leadership and the safety team before release."
    },
    {
      "id": "restrict",
      "title": "Consider a restricted deployment",
      "text": "Explore operating restrictions or a safe fallback. Do not assume these controls work without verification."
    },
    {
      "id": "resign",
      "title": "Resign in protest",
      "text": "Consider whether leaving the organisation changes the risk, and what responsibilities remain."
    },
    {
      "id": "report",
      "title": "Report concerns externally",
      "text": "Consider an appropriate external channel, evidence, urgency, confidentiality and the limits of internal escalation."
    }
  ]
};
