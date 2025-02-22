interface Props {
    errorNumber: number;
}

const ErrorPageLayout = ({ errorNumber }: Props) => {
    return (
        <div className="error-page-layout">
            <h1>{errorNumber}</h1>
        </div>
    );
};

export default ErrorPageLayout;
