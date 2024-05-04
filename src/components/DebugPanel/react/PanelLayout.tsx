const Field = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <div className={`relative vertical items-start gap-2 full pb-2 pt-4 flex-wrap ${className}`}>{children}</div>;
};

type HeaderProps = {
  classNames?: string;
  children: React.ReactNode;
};

const Header = ({ children, classNames }: HeaderProps) => {
  return (
    <>
      <div className={`w-full h-fit py-1 px-1 horizontal items-center justify-between rounded-lg ${classNames}`}>
        {children}
      </div>
    </>
  );
};

type TriggerProps = {
  setOpen: () => void;
  children: React.ReactNode;
};

const Trigger = ({ setOpen, children }: TriggerProps) => {
  return (
    <button
      onClick={setOpen}
      className={
        "relative hover:bg-slate-100/50 hover:ring-1 hover:ring-slate-100 cursor-pointer rounded-full p-1 group"
      }
    >
      <div className="hidden center group-hover:horizontal absolute translate-x-[50%]" data-tooltip>
        <small className="text-zinc-100 font-semibold">DebugPanel</small>
      </div>
      {children}
    </button>
  );
};

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
};

const Container = ({ children, className }: ContainerProps) => {
  return <aside className={`fixed w-fit h-fit mt-5 ml-5 rounded-lg z-50 max-h-[95%] ${className}`}>{children}</aside>;
};

const Body = ({ children, className }: { children: React.ReactNode; className: string }) => {
  return <div className={`py-2 grid grid-cols-2 ${className}`}>{children}</div>;
};

export { Body, Container, Field, Header, Trigger };
