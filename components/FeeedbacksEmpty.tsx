import Image from "next/image";
import AddFeedback from "./panels/AddFeedback";
import IllustrationEmpty from "/public/suggestions/illustration-empty.svg";

const FeedbacksEmpty = () => {
  return (
    <div className="w-full h-full bg-white rounded-[10px] lg:py-[110px] md:py-[90px] sm:py-[76px] grid place-items-center">
      <div className="max-w-[400px] text-center flex flex-col items-center">
        <Image
          className="mb-[50px]"
          src={IllustrationEmpty}
          alt="Illustration Empty"
        ></Image>
        <h1 className="h1 text-navy-blue">There is no feedback yet.</h1>
        <p className="body1 text-steel-blue mt-4">
          Got a suggestion? Found a bug that needs to be squashed? We love
          hearing about new ideas to improve our app.
        </p>
        <AddFeedback className="mt-6" />
      </div>
    </div>
  );
};

export default FeedbacksEmpty;
