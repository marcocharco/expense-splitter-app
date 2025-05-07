import GroupList from "@/components/groups/GroupList";
import React from "react";

const Home = () => {
  return (
    <section className="layout-container">
      <div className="layout-content text-xl">
        Welcome User
        <GroupList />
      </div>
    </section>
  );
};

export default Home;
