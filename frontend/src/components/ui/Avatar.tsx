type AvatarProps = { name: string; className?: string };

export function Avatar({ name, className = "" }: AvatarProps) {
  return (
    <div className={`avatar ${className}`} aria-hidden="true">
      {name.slice(0, 1).toUpperCase()}
    </div>
  );
}
