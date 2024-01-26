import "./style.css";


const LoadingSpinner = ({ color, bgColor, marginLeft, marginRight, width, height, className }) => {
    const customSpinnerColor = {
        borderTopColor: color ? color : "#57A639",
        marginLeft: marginLeft ? marginLeft : "auto",
        marginRight: marginRight ? marginRight : "auto",
        width: width ? width : "3rem",
        height: height ? height : "3rem",
        backgroundColor: bgColor ? bgColor : 'transparent'
    }

    return <div id="loading" className={`display ${className ? className : ''}`} style={customSpinnerColor}></div>
}

export default LoadingSpinner;
