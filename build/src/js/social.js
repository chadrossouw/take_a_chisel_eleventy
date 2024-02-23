/*Sharing on Mobile*/
const sharOnMobile = ()=>{
	const isMobileDevice = window.innerWidth<1000;
	const shareButton = document.querySelector('#share');
	if(isMobileDevice && shareButton){
		shareButton.addEventListener('click', async (e)=>{
				const title = document.title;
				const url = document.URL;
				const data ={'url':url,'title':title};
				try {
					await navigator.share(data)
					console.log = 'Shared successfully'
				} catch(err) {
					console.log = 'Not shared'
				}
			});
	}
}
export default sharOnMobile;