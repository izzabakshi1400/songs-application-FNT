import Logo from "./Logo";

export default function AppBrand() {
  return (
    <div className="appBrandTop">
      <div className="appBrandInner">
        <Logo size={34} />
        <div className="appBrandText">Songs</div>
      </div>
    </div>
  );
}
