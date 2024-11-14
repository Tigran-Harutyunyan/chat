import { onBeforeMount } from "vue";
import { useRouter } from "vue-router";

export function useAuthGuard(isSignedIn: boolean | undefined) {
    const router = useRouter();

    onBeforeMount(() => {
        if (isSignedIn) {
            router.push('/')
        }
    })
}