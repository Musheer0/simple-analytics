import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div>
      <Link href={"/test/" + Math.random() * 3}>tet</Link>
    </div>
  );
};

export default page;
