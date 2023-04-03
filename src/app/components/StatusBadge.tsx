import clsx from "clsx";

export enum Status {
  WARNING,
  ERROR,
  SUCCESS,
}

type Props = {
  status: Status;
  children: React.ReactNode;
};

export default function StatusBadge({ status, children }: Props) {
  return (
    <div
      className={clsx(
        "flex w-fit items-center gap-2 rounded-full px-2 py-1 text-sm",
        status == Status.WARNING && "bg-orange-200",
        status == Status.ERROR && "bg-red-200",
        status == Status.SUCCESS && "bg-green-200"
      )}
    >
      <div
        className={clsx(
          "h-2 w-2 rounded-full border",
          status == Status.WARNING && "border-orange-500",
          status == Status.ERROR && "border-red-500",
          status == Status.SUCCESS && "border-green-500"
        )}
      />
      {children}
    </div>
  );
}
