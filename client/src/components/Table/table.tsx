import styles from "./Table.module.scss";

const mockData = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "johndoe@gmail.com",
    phone: "1234567890",
    applicationDate: "2021-08-01",
  },
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "johndoe@gmail.com",
    phone: "1234567890",
    applicationDate: "2021-08-01",
  },
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "johndoe@gmail.com",
    phone: "1234567890",
    applicationDate: "2021-08-01",
  },
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "johndoe@gmail.com",
    phone: "1234567890",
    applicationDate: "2021-08-01",
  },
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "johndoe@gmail.com",
    phone: "1234567890",
    applicationDate: "2021-08-01",
  },
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "johndoe@gmail.com",
    phone: "1234567890",
    applicationDate: "2021-08-01",
  },
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "johndoe@gmail.com",
    phone: "1234567890",
    applicationDate: "2021-08-01",
  },
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "johndoe@gmail.com",
    phone: "1234567890",
    applicationDate: "2021-08-01",
  },
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "johndoe@gmail.com",
    phone: "1234567890",
    applicationDate: "2021-08-01",
  },
];

const Table:React.FC = () => {
  return (
    <div className={styles['table-wrapper']}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Application ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Application Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {mockData.map((data) => (
            <tr key={data.id}>
              <td>{data.id}</td>
              <td>{data.firstName} {data.lastName}</td>
              <td>{data.email}</td>
              <td>{data.phone}</td>
              <td>{data.applicationDate}</td>
              <td>
                <button>View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Table;
