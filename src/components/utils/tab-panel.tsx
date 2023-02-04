import { Button, CircularProgress } from '@material-ui/core';
import { useMemo, useState } from 'react';
import Loading from './loading';
import styles from './tab-panel.module.scss';

export interface TabPanelProps {
  buttonTitles: string[],
  tabContents: JSX.Element[],
  onTabSwitch?: (selectedIndex?: number) => void
  loading?: boolean
  initialSelectedIndex?: number
  stretchTabs?: boolean
}

const TabPanel = (props: TabPanelProps) => {

  const {
    buttonTitles,
    onTabSwitch,
    loading,
    initialSelectedIndex = 0,
    stretchTabs = true
  } = props;

  const [visibleTabIndex, setVisibleTabIndex] = useState(initialSelectedIndex);

  const tabContents = useMemo(() => props.tabContents.reduce((agg: { [key: number]: JSX.Element },
    c: JSX.Element,
    i: number) => ({ ...agg, [i]: c }), {}), [props.tabContents]);

  const handleTabBtnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const selectedIndex = +e.currentTarget.id;
    setVisibleTabIndex(selectedIndex);
    if (onTabSwitch) onTabSwitch(selectedIndex)
  };

  return (
    <div className={styles.container}>
      <div className={styles['tab-buttons']}>
        {buttonTitles.map((t, i) => (
          <Button
            classes={{ root: styles[stretchTabs ? 'btn--stretched' : 'btn--squashed' ] }}
            color='primary'
            key={i}
            id={i.toString()}
            onClick={handleTabBtnClick}
            variant={visibleTabIndex === i ? 'contained' : 'outlined'}
          >
            {t}
          </Button>
        ))}
      </div>
      <div className={styles['tab-content']}>
        {loading ? <CircularProgress className={styles.loading} /> : tabContents[visibleTabIndex]}
      </div>
    </div>
  )
};

export default TabPanel;