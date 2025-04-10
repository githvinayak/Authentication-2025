import Header from "@/components/Header";
const Home = () => {
  return (
    <div>
      <Header />
      <main className="p-6">
        <h2 className="text-2xl font-semibold">Welcome to the Home Page!</h2>
        <p className="mt-2 text-gray-600">You're logged in 🎉</p>
      </main>
    </div>
  );
};

export default Home;
