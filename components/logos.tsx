interface LogoProps extends React.SVGProps<SVGSVGElement> {
    width?: number | string;
    height?: number | string;
    className?: string;
}

export const Nix: React.FC<LogoProps> = ({ width, height, className, ...props }) => {
    const svgWidth =
        width !== undefined ? (typeof width === "number" ? `${width}px` : width) : undefined;
    const svgHeight =
        height !== undefined ? (typeof height === "number" ? `${height}px` : height) : undefined;

    return <>Logo Nix</>;
};
