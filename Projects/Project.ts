export type ProjectStatus = "Ongoing" | "Completed";

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  ward: string;
  status: ProjectStatus;
  href: string;
  completedDate?: string;
  location?: string;
  eventTypes?: string;
  eventCategory?: string;
  problem?: string;
  action?: string;
  outcome?: string;
  galleryImages?: string[];
}

export const featuredProjects: Project[] = [
  {
    id: "rural-road-blacktopping",
    title: "Rural Road Blacktopping Project",
    description:
      "12km of gravel road upgraded to blacktop, connecting three villages to the district headquarters.",
    image: "/images/image5.jpg",
    galleryImages: [
      "/images/image5.jpg",
      "/images/image2.jpg",
      "/images/image6.jpg",
      "/images/image5.jpg",
    ],
    category: "Infrastructure",
    ward: "Ward 4",
    status: "Ongoing",
    href: "/work/rural-road-blacktopping",
    completedDate: "Falgun 2082 (March 2026)",
    location: "Ward 4, Kalikot",
    eventTypes: "Road improvement",
    eventCategory: "Infrastructure",
    problem:
      "Communities in Ward 4 were isolated during the rainy season, with long travel times to markets and health services.",
    action:
      "The project paved 12km of gravel road, coordinated local contractors, and improved drainage across multiple village sections.",
    outcome:
      "Local travel time was cut by over half, and transport reliability improved for students, farmers, and emergency vehicles.",
  },
  {
    id: "community-health-post",
    title: "Community Health Post Construction",
    description:
      "A fully-equipped health post now serves over 2,000 residents across three remote wards.",
    image: "/images/image3.jpg",
    galleryImages: [
      "/images/image3.jpg",
      "/images/image8.jpg",
      "/images/image9.jpg",
      "/images/image3.jpg",
    ],
    category: "Health",
    ward: "Ward 9",
    status: "Completed",
    href: "/work/community-health-post",
    completedDate: "Falgun 2081 (February 2025)",
    location: "Ward 9, Kalikot",
    eventTypes: "Action alert",
    eventCategory: "Media",
    problem:
      "Ward 9 residents previously had to travel over two hours to reach the nearest health facility, resulting in delayed emergency care.",
    action:
      "The Chairperson’s office allocated budget for a fully-equipped health post, coordinated with the Ministry of Health, and hired local contractors.",
    outcome:
      "The health post now serves over 2,000 residents, reducing average travel time to under 20 minutes and improving maternal care access.",
  },
  {
    id: "drinking-water-supply",
    title: "Drinking Water Supply Scheme",
    description:
      "Piped drinking water extended to 850 households through a new gravity-flow system.",
    image: "/images/image4.jpg",
    galleryImages: [
      "/images/image4.jpg",
      "/images/image10.jpg",
      "/images/image11.jpg",
      "/images/image4.jpg",
    ],
    category: "Water & Sanitation",
    ward: "Ward 2",
    status: "Completed",
    href: "/work/drinking-water-supply",
    completedDate: "Chaitra 2081 (April 2025)",
    location: "Ward 2, Kalikot",
    eventTypes: "Community outreach",
    eventCategory: "Water",
    problem:
      "Many households in Ward 2 lacked access to safe drinking water and relied on seasonal sources.",
    action:
      "A new gravity-flow water system was built, connecting springs to community taps and household outlets.",
    outcome:
      "The scheme now supplies clean water to 850 households, improving sanitation and reducing waterborne illnesses.",
  },
];

export const newsProjects: Project[] = [
  {
    id: "news-road-progress",
    title: "Chairperson Meets Ward Chairs to Review Rural Road Progress",
    description:
      "A coordination meeting reviewed timelines for the ongoing blacktopping project and next steps for connected villages.",
    image: "/images/news4.jpg",
    category: "Setopati",
    ward: "Ward 4",
    status: "Ongoing",
    href: "/news/chairperson-meets-ward-chairs",
  },
  {
    id: "news-electrification-mou",
    title: "Kalikot Signs MoU for Rural Electrification Project",
    description:
      "The agreement brings grid electricity to four previously unconnected wards, advancing rural development goals.",
    image: "/images/news5.jpg",
    category: "Nagarik News",
    ward: "Ward 9",
    status: "Completed",
    href: "/news/rural-electrification-mou",
  },
  {
    id: "news-health-post-forum",
    title: "Chairperson Attends Karnali Province Development Forum",
    description:
      "Discussions focused on inter-district infrastructure coordination and funding for health, roads, and education.",
    image: "/images/news6.jpg",
    category: "RSS Nepal",
    ward: "Ward 3",
    status: "Completed",
    href: "/news/attends-development-forum",
  },
  {
    id: "news-water-scheme",
    title: "Drinking Water Scheme Reaches Final Construction Phase",
    description:
      "Piped water is expected to reach 850 households by the end of the fiscal year, improving health and sanitation.",
    image: "/images/news7.jpg",
    category: "Annapurna Post",
    ward: "Ward 2",
    status: "Completed",
    href: "/news/drinking-water-scheme-final-phase",
  },
];