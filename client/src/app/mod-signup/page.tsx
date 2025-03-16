import SignupForm from "./SignupForm";

export default function page() {
  return (
    <div className="grid grid-cols-[65%_35%] min-h-screen">
      <div className="border-r border-muted"></div>
      <div>
        <SignupForm />
      </div>
    </div>
  );
}

