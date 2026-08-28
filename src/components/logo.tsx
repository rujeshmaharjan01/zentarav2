import Image from "next/image";

const LogoImage = ({
  className = "",
  width = 100,
  height = 100,
}: {
  className?: string;
  width?: number;
  height?: number;
}) => {
  return (
    <Image src="/zentaraLogo.svg" alt="logo" width={width} height={height} className={className} />
  );
};

export default LogoImage;
