export const skillCategories = [
  {
    category: "Core CS",
    color: "purple",
    skills: [
      "DSA",
      "OOP",
      "OS",
      "DBMS",
      "Networks",
      "System Design",
      "Algorithms",
      "Computer Architecture"
    ]
  },
  {
    category: "Languages",
    color: "blue",
    skills: [
      "C++",
      "Python",
      "Java",
      "JavaScript",
      "C",
      "Go",
      "Rust",
      "TypeScript"
    ]
  },
  {
    category: "Web Dev",
    color: "teal",
    skills: [
      "React",
      "Node.js",
      "Next.js",
      "SQL",
      "MongoDB",
      "REST APIs",
      "GraphQL",
      "Tailwind CSS"
    ]
  },
  {
    category: "Cloud & DevOps",
    color: "amber",
    skills: [
      "AWS",
      "Azure",
      "Google Cloud",
      "Docker",
      "Kubernetes",
      "Linux",
      "CI/CD",
      "Terraform"
    ]
  },
  {
    category: "AI & Data",
    color: "green",
    skills: [
      "Machine Learning",
      "Deep Learning",
      "TensorFlow",
      "PyTorch",
      "NLP",
      "Computer Vision",
      "Data Analysis",
      "Statistics"
    ]
  },
  {
    category: "Other",
    color: "coral",
    skills: [
      "Git",
      "Agile/Scrum",
      "Problem Solving",
      "Communication",
      "Leadership",
      "Excel",
      "Figma",
      "Testing"
    ]
  }
]

export const allSkills = skillCategories.flatMap(cat => cat.skills)
