import { useUser } from "vue-clerk";
export function useClerkUser() {
    const { user } = useUser();
    return {
        email: user.value?.emailAddresses[0]?.emailAddress
    }
}