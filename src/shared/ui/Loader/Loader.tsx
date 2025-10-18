import s from "./Loader.module.css";

export const Loader = () => {
  return (
    <div className="centered">
      <div className={s.loader} />
    </div>
  );
};
