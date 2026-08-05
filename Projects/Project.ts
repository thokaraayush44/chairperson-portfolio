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
}

export const featuredProjects: Project[] = [
  {
    id: "rural-road-blacktopping",
    title: "Rural Road Blacktopping Project",
    description:
      "12km of gravel road upgraded to blacktop, connecting three villages to the district headquarters.",
    image: "/images/image5.jpg",
    category: "Infrastructure",
    ward: "Ward 4",
    status: "Ongoing",
    href: "/projects/rural-road-blacktopping",
  },
  {
    id: "community-health-post",
    title: "Community Health Post Construction",
    description:
      "A fully-equipped health post now serves over 2,000 residents across three remote wards.",
    image: "/images/image3.jpg",
    category: "Health",
    ward: "Ward 9",
    status: "Completed",
    href: "/projects/community-health-post",
  },
  {
    id: "drinking-water-supply",
    title: "Drinking Water Supply Scheme",
    description:
      "Piped drinking water extended to 850 households through a new gravity-flow system.",
    image: "/images/image4.jpg",
    category: "Water & Sanitation",
    ward: "Ward 2",
    status: "Completed",
    href: "/projects/drinking-water-supply",
  },
];