export default function NextImageMock(props) {
	return <img alt={props.alt || ""} {...props} />;
}
