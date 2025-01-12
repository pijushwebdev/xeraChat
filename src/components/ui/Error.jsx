/* eslint-disable react/prop-types */


const Error = ({error}) => {
    return (
        <div className="text-center text-red-500">
            {error}
        </div>
    );
};

export default Error;