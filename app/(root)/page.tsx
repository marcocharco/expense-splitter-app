import GroupList from "@/components/groups/GroupList";
import React from "react";

const Home = () => {
  return (
    <section className="layout-container">
      <div className="layout-content">
        <h1>
          Welcome, <span className="text-main">Bob</span>
        </h1>
        <GroupList />
      </div>
    </section>
  );
};

export default Home;
