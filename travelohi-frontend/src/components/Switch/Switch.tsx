import './Switch.css'

type SwitchProps = {
  onToggle: (on : boolean) => void;
  isOn: boolean;
};

const Switch: React.FC<SwitchProps> = ({ onToggle, isOn }) => {
  return (
    <label className="switch">
      <input type="checkbox" className="checkbox" checked={isOn} onChange={() => onToggle(isOn)} />
      <div className="slider"></div>
    </label>
  );
};

export default Switch;