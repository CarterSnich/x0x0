const { createApp, ref, onMounted, watch } = Vue;

function getUploads() {
	const uploads = localStorage.getItem("uploads");
	return uploads ? JSON.parse(uploads) : [];
}

createApp({
	delimiters: ["${", "}"],
	setup() {
		const uploads = ref([]);
		const showDropTarget = ref(false);

		watch(uploads, async (newQuestion, oldQuestion) => {
			localStorage.setItem("uploads", JSON.stringify(uploads.value));
		});

		onMounted(() => {
			uploads.value = getUploads();
		});

		const onFileDrop = async (e) => {
			const file = e.dataTransfer.files[0];

			const body = new FormData();
			body.append("file", file);

			try {
				const response = await fetch("upload", {
					method: "POST",
					body: body,
				});

				if (!response.ok) {
					throw new Error(`Failed to upload file: ${file.name}`);
				}

				const url = await response.text();

				uploads.value = [
					...uploads.value,
					{
						url: url,
						filename: file.name,
						size: file.size,
						mimetype: file.type,
					},
				];

				showDropTarget.value = false;
			} catch (error) {
				console.error("Error uploading file:", error);
				alert(`Error uploading file: ${error}`);
			}
		};

		return {
			showDropTarget,
			uploads,
			onFileDrop,
		};
	},
}).mount("#app");
