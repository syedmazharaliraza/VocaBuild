import { Switch, Tooltip } from "@mantine/core";
import logo from "../../assets/images/logo.png";
import githubIcon from "../../assets/icons/github.svg";
import styles from "./index.module.css";
import openNewTab from "../../utils/openNewTab";
import useChromeStorage from "../../hooks/useChromeStorage";

const Topbar = () => {
  const [checked, setChecked] = useChromeStorage("extension_active", true);

  return (
    <div className={styles.container}>
      <Tooltip label={`Turn ${checked ? "off" : "on"} VocaBuild`} withArrow>
        <div>
          <Switch
            checked={checked}
            onChange={(event) => setChecked(event.currentTarget.checked)}
            style={{ width: 38 }}
            color="teal"
          />
        </div>
      </Tooltip>

      <img src={logo} alt="logo" className={styles.logo} width={18} />
      <Tooltip label="Contribute" position="left" withArrow>
        <img
          src={githubIcon}
          alt="github-logo"
          width={26}
          onClick={() => {
            openNewTab("https://github.com/syedmazharaliraza/VocaBuild");
          }}
        />
      </Tooltip>
    </div>
  );
};

export default Topbar;
