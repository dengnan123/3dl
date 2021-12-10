import styles from './index.less';

export default ({ child = [] }) => {
  return (
    <div className={styles.pageWrap}>
      {child.map(v => {
        const { renderChildComp } = v;
        return renderChildComp;
      })}
    </div>
  );
};
