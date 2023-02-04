import Table, { TableTypeMap } from "@material-ui/core/Table";
import TableCell from "@material-ui/core/TableCell";
import withStyles from "@material-ui/core/styles/withStyles";
import { DefaultComponentProps } from "@material-ui/core/OverridableComponent";
import styles from './custom-table.module.scss';

export interface CustomTableProps extends DefaultComponentProps<TableTypeMap<{}, "table">> {
  isEmpty: boolean
  emptyTableMessage?: string
}

export const StyledTableCell = withStyles({
  root: {
    fontSize: '1.2rem'
  }
})(TableCell);

const CustomTable = (props: CustomTableProps) => {
  const { isEmpty, emptyTableMessage = 'No Data', ...rest } = props;
  return isEmpty ?
    (
      <div className={styles.empty}>
        <p>{emptyTableMessage}</p>
      </div>
    )
    :
    (
      <Table className={styles.table} {...rest}>
        {props.children}
      </Table >
    );
};

export default CustomTable
