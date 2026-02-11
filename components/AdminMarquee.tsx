// components/AdminMarquee.tsx
'use client'; // Only needed if you want to add interactive features later

interface AdminMarqueeProps {
  message: string;
  bgColor?: string;
  textColor?: string;
  speed?: number;
  icon?: React.ReactNode;
}

const AdminMarquee = ({
  message,
  bgColor = 'bg-red-500',
  textColor = 'text-white',
  speed = 20,
  icon = '⚠️'
}: AdminMarqueeProps) => {
  return (
    <div className={`${bgColor} ${textColor} p-2 overflow-x-hidden`}>
      <div 
        className="whitespace-nowrap animate-marquee inline-block"
        style={{ animationDuration: `${speed}s` }}
      >
        <span className="mx-4">{icon}</span>
        <span className="font-semibold">{message}</span>
      </div>
    </div>
  );
};

export default AdminMarquee;
