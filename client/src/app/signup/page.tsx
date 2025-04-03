import Image from "next/image";
import SignupForm from "./SignupForm";

export default function page() {
  return (
    <div className="grid grid-cols-[65%_35%] min-h-screen">
      <div className="border-r border-muted">
        <Image className="object-cover w-full h-full" alt="" width={1800} height={1080} src="https://wallpapercat.com/w/full/4/6/f/1228445-2309x1299-desktop-hd-good-luck-background-photo.jpg" />
      </div>
      <div>
        <SignupForm />
      </div>
    </div>
  );
}

