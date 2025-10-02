import styles from "./PageTitle.module.css";

type TitleProps = {
	imageUrl: string;
	title: string;
};

export default function PageTitle({ imageUrl, title }: TitleProps) {
	return (
		<div className={styles.headerTitle}>
			<img className={styles.pageLogo} alt={title} src={imageUrl}></img>
			<h1>{title}</h1>
		</div>
	);
}
