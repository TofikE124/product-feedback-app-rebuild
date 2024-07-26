import Dropdown from "@/components/Dropdown";

export default function Home() {
  return (
    <main className="w-full h-screen p-10">
      <Dropdown
        options={["a", "b", "c", "d"]}
        defaultMessage="Letter"
        color="cloudy-white"
      ></Dropdown>
    </main>
  );
}
