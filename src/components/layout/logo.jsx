const Logo = () => {
  return (
    <div className="flex justify-start items-center gap-2">
      <svg
        id="logo-38"
        width="78"
        height="32"
        viewBox="0 0 78 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M55.5 0H77.5L58.5 32H36.5L55.5 0Z"
          className="ccustom"
          fill="#ffffff"
        />
        <path
          d="M35.5 0H51.5L32.5 32H16.5L35.5 0Z"
          className="ccompli1"
          fill="#e0e0e0"
        />
        <path
          d="M19.5 0H31.5L12.5 32H0.5L19.5 0Z"
          className="ccompli2"
          fill="#cfcfcf"
        />
      </svg>
      <span
        className="text-3xl font-semibold hidden sm:inline text-white font-[Poppins] drop-shadow-md tracking-wide"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        Syncronous
      </span>
    </div>
  );
};

export default Logo;
