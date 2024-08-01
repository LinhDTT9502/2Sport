import { Fragment, useEffect, useState } from "react";
import {
    Card,
    Breadcrumbs,
    CardBody,
    Typography,
    Avatar,
    Checkbox,
    Collapse,
    Button,
    IconButton,
} from "@material-tailwind/react";
import { fetchOrders } from "../../services/DashboardService";
import { useTranslation } from "react-i18next";
import { selectUser } from "../../redux/slices/authSlice";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function RecentOrder() {
    const { t } = useTranslation();
    const [orders, setOrders] = useState([]);
    const [orderDetails, setOrderDetails] = useState({});
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 10;
    const user = useSelector(selectUser);

    const [openOrderDetail, setOrderDetail] = useState(null);
    const [isDescending, setIsDescending] = useState(true);

    const toggleOpen = (orderId) => {
        setOrderDetail((cur) => (cur === orderId ? null : orderId));
    };

    const formatPrice = (value) => {
        return new Intl.NumberFormat('en-US', { minimumFractionDigits: 0 }).format(value) + ' VND';
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const ordersData = await fetchOrders();
                const sortedOrders = ordersData.data.$values.sort((a, b) => isDescending ? b.id - a.id : a.id - b.id);
                setOrders(sortedOrders);

                const detailsMap = {};
                sortedOrders.forEach(order => {
                    detailsMap[order.id] = order.orderDetails.$values;
                });
                setOrderDetails(detailsMap);

                const totalOrdersCount = sortedOrders.length;
                const totalAmountSum = sortedOrders.reduce((acc, order) => acc + parseFloat(order.amount), 0);
                setTotalOrders(totalOrdersCount);
                setTotalAmount(totalAmountSum);
                toast.success("Orders fetched successfully");
            } catch (error) {
                console.error('Error fetching orders:', error);
                setOrders([]);
            }
        };

        fetchData();
    }, [isDescending]); // Dependency on isDescending

    const onSelectChange = (selectedKey) => {
        setSelectedRowKeys((prevSelectedRowKeys) =>
            prevSelectedRowKeys.includes(selectedKey)
                ? prevSelectedRowKeys.filter((key) => key !== selectedKey)
                : [...prevSelectedRowKeys, selectedKey]
        );
    };

    const currentOrders = orders.slice(
        (currentPage - 1) * ordersPerPage,
        currentPage * ordersPerPage
    );

    const handleNextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    const handlePrevPage = () => {
        setCurrentPage((prevPage) => prevPage - 1);
    };

    const toggleSortOrder = () => {
        setIsDescending(!isDescending);
    };

    return (
        <>
            <Card className="h-screen w-[95.7%] mx-10 my-10">
                <Typography variant="h6" color="black" className="mx-10 mt-4 text-2xl">
                    {t("dashboard.recent_orders")}
                </Typography>
                <Button onClick={toggleSortOrder} className="mx-10 mt-4 w-fit">
                    {isDescending ? "Sort Ascending" : "Sort Descending"}
                </Button>

                <CardBody className="overflow-scroll px-0">
                    <table className="w-full min-w-max table-auto text-left">
                        <thead>
                            <tr>
                                <th className="border-y border-blue-gray-200 bg-blue-gray-200/50 p-4">
                                    <Checkbox
                                        color="blue"
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedRowKeys(orders.map((row) => row.id));
                                            } else {
                                                setSelectedRowKeys([]);
                                            }
                                        }}
                                        checked={selectedRowKeys.length === orders.length}
                                        indeterminate={
                                            selectedRowKeys.length > 0 &&
                                            selectedRowKeys.length < orders.length
                                        }
                                    />
                                </th>
                                <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                                    <Typography
                                        variant="large"
                                        color="blue-gray"
                                        className="font-normal leading-none opacity-70"
                                    >
                                        #
                                    </Typography>
                                </th>
                                <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                                    <Typography
                                        variant="large"
                                        color="blue-gray"
                                        className="font-normal leading-none opacity-70"
                                    >
                                        {t("dashboard.order_id")}
                                    </Typography>
                                </th>
                                <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                                    <Typography
                                        variant="large"
                                        color="blue-gray"
                                        className="font-normal leading-none opacity-70"
                                    >
                                        {t("dashboard.date")}
                                    </Typography>
                                </th>
                                <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                                    <Typography
                                        variant="large"
                                        color="blue-gray"
                                        className="font-normal leading-none opacity-70"
                                    >
                                        {t("dashboard.customer")}
                                    </Typography>
                                </th>
                                <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                                    <Typography
                                        variant="large"
                                        color="blue-gray"
                                        className="font-normal leading-none opacity-70"
                                    >
                                        {t("dashboard.status")}
                                    </Typography>
                                </th>
                                <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                                    <Typography
                                        variant="large"
                                        color="blue-gray"
                                        className="font-normal leading-none opacity-70"
                                    >
                                        {t("dashboard.total_price")}
                                    </Typography>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentOrders.map((order, index) => {
                                const isLast = index === currentOrders.length - 1;
                                const classes = isLast
                                    ? "p-4"
                                    : "p-4 border-b border-blue-gray-50";
                                const isSelected = selectedRowKeys.includes(order.id);

                                return (
                                    <Fragment key={order.id}>
                                        <tr
                                            onClick={() => toggleOpen(order.id)}
                                            className={isSelected ? "bg-blue-100" : ""}
                                        >
                                            <td className={classes}>
                                                <Checkbox
                                                    color="blue"
                                                    checked={isSelected}
                                                    onChange={() => onSelectChange(order.id)}
                                                />
                                            </td>
                                            <td className={classes}>
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal"
                                                >
                                                    {(currentPage - 1) * ordersPerPage + index + 1}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal"
                                                >
                                                    {order.orderCode}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal"
                                                >
                                                    {new Date(order.createDate).toLocaleDateString()}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <div className="flex items-center">
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-normal"
                                                    >
                                                        {order.customerName}
                                                    </Typography>
                                                </div>
                                            </td>
                                            <td className={classes}>
                                                <div className={`flex items-center justify-center ${order.status === "PAID"
                                                    ? "text-green-500 border rounded-full w-fit px-2 border-green-500"
                                                    : order.status === "CANCELLED"
                                                        ? "text-red-500 border rounded-full w-fit px-2 border-red-500"
                                                        : order.status === "PROCESSING"
                                                            ? "text-orange-400 border rounded-full w-fit px-2 border-orange-400"
                                                            : "text-gray-500 border rounded-full w-fit px-2 border-gray-500"
                                                    }`}>
                                                    <Typography
                                                        variant="small"
                                                        className="font-normal"
                                                    >
                                                        {order.status}
                                                    </Typography>
                                                </div>
                                            </td>
                                            <td className={classes}>
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal"
                                                >
                                                    {formatPrice(order.amount)}
                                                </Typography>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan={7} className="p-0">
                                                <Collapse in={openOrderDetail === order.id}>
                                                    <table className="w-full table-auto text-left">
                                                        <thead>
                                                            <tr>
                                                                <th className="p-4">
                                                                    <Typography
                                                                        variant="small"
                                                                        color="blue-gray"
                                                                        className="font-normal"
                                                                    >
                                                                        {t("dashboard.product_name")}
                                                                    </Typography>
                                                                </th>
                                                                <th className="p-4">
                                                                    <Typography
                                                                        variant="small"
                                                                        color="blue-gray"
                                                                        className="font-normal"
                                                                    >
                                                                        {t("dashboard.unit_price")}
                                                                    </Typography>
                                                                </th>
                                                                <th className="p-4">
                                                                    <Typography
                                                                        variant="small"
                                                                        color="blue-gray"
                                                                        className="font-normal"
                                                                    >
                                                                        {t("dashboard.quantity")}
                                                                    </Typography>
                                                                </th>
                                                                <th className="p-4">
                                                                    <Typography
                                                                        variant="small"
                                                                        color="blue-gray"
                                                                        className="font-normal"
                                                                    >
                                                                        {t("dashboard.amount")}
                                                                    </Typography>
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {orderDetails[order.id]?.map((item, detailIndex) => (
                                                                <tr key={detailIndex}>
                                                                    <td className="p-4">
                                                                        <Typography
                                                                            variant="small"
                                                                            color="blue-gray"
                                                                            className="font-normal"
                                                                        >
                                                                            {item.productName}
                                                                        </Typography>
                                                                    </td>
                                                                    <td className="p-4">
                                                                        <Typography
                                                                            variant="small"
                                                                            color="blue-gray"
                                                                            className="font-normal"
                                                                        >
                                                                            {formatPrice(item.unitPrice)}
                                                                        </Typography>
                                                                    </td>
                                                                    <td className="p-4">
                                                                        <Typography
                                                                            variant="small"
                                                                            color="blue-gray"
                                                                            className="font-normal"
                                                                        >
                                                                            {item.quantity}
                                                                        </Typography>
                                                                    </td>
                                                                    <td className="p-4">
                                                                        <Typography
                                                                            variant="small"
                                                                            color="blue-gray"
                                                                            className="font-normal"
                                                                        >
                                                                            {formatPrice(item.amount)}
                                                                        </Typography>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </Collapse>
                                            </td>
                                        </tr>
                                    </Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                </CardBody>
                <div className="flex justify-between items-center px-4 py-2">
                    <IconButton
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                    >
                       prev
                    </IconButton>
                    <Typography variant="small">
                        page {currentPage} of {" "}
                        {Math.ceil(orders.length / ordersPerPage)}
                    </Typography>
                    <IconButton
                        onClick={handleNextPage}
                        disabled={currentPage * ordersPerPage >= orders.length}
                    >
                       next
                    </IconButton>
                </div>
            </Card>
        </>
    );
}