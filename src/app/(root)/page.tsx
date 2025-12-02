import GroupList from "@/features/groups/components/GroupList";
import Header from "@/components/root/Header";
import PendingInvitations from "@/features/groups/components/PendingInvitations";

const Home = () => {
  // console.log(groups);
  return (
    <section className="layout-container">
      <div className="layout-content">
        <Header />
        <div className="flex w-full flex-col gap-4">
          <PendingInvitations />
          <GroupList />
        </div>
      </div>
    </section>
  );
};

export default Home;
