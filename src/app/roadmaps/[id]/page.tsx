"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css"
const roadmaps = [
  { id: 1, title: "Frontend", description: "Learn HTML, CSS, JS, React", icon: "🌐", details: "Frontend roadmap includes mastering HTML, CSS, JS, React, and related tools.Frontend roadmap includes mastering HTML, CSS, JS, React, and related tools.Frontend roadmap includes mastering HTML, CSS, JS, React, and related tools.Frontend roadmap includes mastering HTML, CSS, JS, React, and related tools.Frontend roadmap includes mastering HTML, CSS, JS, React, and related tools.Frontend roadmap includes mastering HTML, CSS, JS, React, and related tools.Frontend roadmap includes mastering HTML, CSS, JS, React, and related tools.Frontend roadmap includes mastering HTML, CSS, JS, React, and related tools.Frontend roadmap includes mastering HTML, CSS, JS, React, and related tools.Frontend roadmap includes mastering HTML, CSS, JS, React, and related tools.Frontend roadmap includes mastering HTML, CSS, JS, React, and related tools.Frontend roadmap includes mastering HTML, CSS, JS, React, and related tools.Frontend roadmap includes mastering HTML, CSS, JS, React, and related tools.Frontend roadmap includes mastering HTML, CSS, JS, React, and related tools.Frontend roadmap includes mastering HTML, CSS, JS, React, and related tools.Frontend roadmap includes mastering HTML, CSS, JS, React, and related tools.Frontend roadmap includes mastering HTML, CSS, JS, React, and related tools.Frontend roadmap includes mastering HTML, CSS, JS, React, and related tools.Frontend roadmap includes mastering HTML, CSS, JS, React, and related tools." },
  { id: 2, title: "Backend", description: "Servers, APIs, Databases", icon: "🛠️", details: "Backend roadmap includes Node.js, Express, databases, APIs, authentication, and more. Backend roadmap includes Node.js, Express, databases, APIs, authentication, and more.Backend roadmap includes Node.js, Express, databases, APIs, authentication, and more.Backend roadmap includes Node.js, Express, databases, APIs, authentication, and more.Backend roadmap includes Node.js, Express, databases, APIs, authentication, and more.Backend roadmap includes Node.js, Express, databases, APIs, authentication, and more.Backend roadmap includes Node.js, Express, databases, APIs, authentication, and more.Backend roadmap includes Node.js, Express, databases, APIs, authentication, and more.Backend roadmap includes Node.js, Express, databases, APIs, authentication, and more.Backend roadmap includes Node.js, Express, databases, APIs, authentication, and more.Backend roadmap includes Node.js, Express, databases, APIs, authentication, and more.Backend roadmap includes Node.js, Express, databases, APIs, authentication, and more.Backend roadmap includes Node.js, Express, databases, APIs, authentication, and more.Backend roadmap includes Node.js, Express, databases, APIs, authentication, and more.Backend roadmap includes Node.js, Express, databases, APIs, authentication, and more.Backend roadmap includes Node.js, Express, databases, APIs, authentication, and more.Backend roadmap includes Node.js, Express, databases, APIs, authentication, and more.Backend roadmap includes Node.js, Express, databases, APIs, authentication, and more.Backend roadmap includes Node.js, Express, databases, APIs, authentication, and more.Backend roadmap includes Node.js, Express, databases, APIs, authentication, and more.Backend roadmap includes Node.js, Express, databases, APIs, authentication, and more.Backend roadmap includes Node.js, Express, databases, APIs, authentication, and more.Backend roadmap includes Node.js, Express, databases, APIs, authentication, and more.Backend roadmap includes Node.js, Express, databases, APIs, authentication, and more.Backend roadmap includes Node.js, Express, databases, APIs, authentication, and more.Backend roadmap includes Node.js, Express, databases, APIs, authentication, and more.Backend roadmap includes Node.js, Express, databases, APIs, authentication, and more.Backend roadmap includes Node.js, Express, databases, APIs, authentication, and more.Backend roadmap includes Node.js, Express, databases, APIs, authentication, and more." },
];

export default function RoadmapDetailsPage() {
  const params = useParams();
  const pramId = Number(params.id);

  const roadmap = roadmaps.find((roadmap) => roadmap.id === pramId);

  if (!roadmap) {
    return <div>Sorry! Cannot Find Roadmap</div>;
  }

  return (
    <div className={styles.roadmapDetailsContainer}>
      {/* <img className={styles.roadmapIcon} src={roadmap.img} alt={roadmap.title}/> */}
      <div className={styles.roadmapTitleContainer}>
        <h1 className={styles.roadmapTitle}>{roadmap.icon}</h1>
        <h1 className={styles.roadmapTitle}>
          {roadmap.title} Roadmap
        </h1>
      </div>
      <p className={styles.details}>
        {roadmap.details}
      </p>

      <div className={styles.links}>
        <Link href="/roadmaps" className={styles.link}>
          Back to Roadmaps
        </Link>
        <Link href="/student" className={styles.link}>
          Continue with {roadmap.title}
        </Link>
      </div>
    </div>
  );
}
