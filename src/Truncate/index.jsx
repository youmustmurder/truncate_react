import React from "react";
import { debounce } from "lodash"

class Truncate extends React.Component {
    constructor(props) {
        super(props);
        this.containerRef = React.createRef();
        this.debounceResize = debounce(this.onResult, 200);
    }
    componentDidMount() {
        this.processTruncate();
        this.onResult();
        window.addEventListener("resize", this.debounceResize, false);
    }
    componentDidUpdate() {
        this.processTruncate();
    }
    componentWillUnmount() {
        window.removeEventListener("resize", this.debounceResize, false);
    }
    processTruncate = () => {
        const style = this.containerRef.current.style;
        if (this.props.truncate) {
            style.overflow = "hidden";
            style.textOverflow = "ellipsis";
            style.webkitBoxOrient = "vertical";
            style.display = "-webkit-box";
            style.webkitLineClamp = this.props.countLines;
        } else {
            style.webkitLineClamp = "unset";
        }
    }
    onResult = () => {
        this.props.onResult(this.containerRef.current.scrollWidth > this.containerRef.current.clientWidth || this.containerRef.current.scrollHeight > this.containerRef.current.clientHeight);
    }
    render() {
        return (
            <div ref={this.containerRef}>
                {this.props.children}
            </div>
        );
    }
}

export default Truncate;