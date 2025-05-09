import { createClient } from "@/utils/supabase/server";

import GroupList from "@/components/groups/GroupList";
import React from "react";

const Home = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const name = user?.user_metadata?.name;

  return (
    <section className="layout-container">
      <div className="layout-content">
        <h1>
          Welcome
          {name && (
            <>
              ,&nbsp;<span className="text-main">{name}</span>
            </>
          )}
        </h1>
        <GroupList />
      </div>
    </section>
  );
};

export default Home;
