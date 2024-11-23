<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import {
  AlertTriangle,
  ChevronDownIcon,
  Loader,
  MailIcon,
  XIcon,
} from "lucide-vue-next";

import ConfirmDialog from "@/components/ConfirmDialog.vue";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";

import { Id } from "@convex/dataModel";

const confirm = ref<InstanceType<typeof ConfirmDialog> | null>(null);

type EmitType = {
  (event: "close"): void;
};

interface ProfileProps {
  memberId: Id<"members">;
}

const props = defineProps<ProfileProps>();

const emit = defineEmits<EmitType>();

import { useGetMember } from "@/features/members/api/useGetMember";
import { useUpdateMember } from "@/features/members/api/useUpdateMember";
import { useRemoveMember } from "@/features/members/api/useRemoveMember";
import { useCurrentMember } from "@/features/members/api/useCurrentMember";
import { useWorkspaceId } from "@/features/workspace/hooks/useWorkspaceId";
import { useClerkUser } from "@/composables/useClerkUser";

const { workspaceId } = useWorkspaceId();
const { email } = useClerkUser();
const { data: member, isLoading: isLoadingMember } = useGetMember(
  props.memberId
);
const { mutate: updateMember } = useUpdateMember();
const { mutate: removeMember } = useRemoveMember();
const { data: currentMember } = useCurrentMember(workspaceId.value);
const router = useRouter();

const onRemove = async () => {
  const ok = await confirm.value?.openModal(
    "Remove member",
    "Are you sure you want to remove this member?"
  );

  if (!ok) return;

  const id = await removeMember({ id: props.memberId, email });

  if (id) {
    emit("close");
  }
};

const onLeave = async () => {
  const ok = await confirm.value?.openModal(
    "Leave workspace",
    "Are you sure you want to leave this workspace?"
  );

  if (!ok) return;

  const id = await removeMember({ id: props.memberId, email });
  if (id) {
    router.push("/workspace");
    setTimeout(() => {
      emit("close");
    }, 500);
  }
};

const onUpdate = async (role: "admin" | "member") => {
  const ok = await confirm.value?.openModal(
    "Change role",
    "Are you sure you want to change this member's role?"
  );

  if (!ok) return;

  const id = await updateMember({ id: props.memberId, role, email });
  if (id) {
    emit("close");
  }
};
</script>

<template>
  <div v-if="isLoadingMember" class="h-full flex flex-col">
    <div class="h-[49px] flex justify-between items-center px-4 border-b">
      <p class="text-lg font-bold">Profile</p>
      <Button @click="emit('close')" size="iconSm" variant="ghost">
        <XIcon class="size-5 stroke-[1.5]" />
      </Button>
    </div>
    <div class="flex flex-col gap-y-2 h-full items-center justify-center">
      <Loader class="size-5 animate-spin text-muted-foreground" />
    </div>
  </div>
  <template v-else>
    <div v-if="!member" class="h-full flex flex-col">
      <div class="h-[49px] flex justify-between items-center px-4 border-b">
        <p class="text-lg font-bold">Profile</p>
        <Button @click="emit('close')" size="iconSm" variant="ghost">
          <XIcon class="size-5 stroke-[1.5]" />
        </Button>
      </div>
      <div class="flex flex-col gap-y-2 h-full items-center justify-center">
        <AlertTriangle class="size-5 text-muted-foreground" />
        <p class="text-sm text-muted-foreground">Profile not found</p>
      </div>
    </div>

    <template v-else>
      <ConfirmDialog ref="confirm" />
      <div class="h-full flex flex-col">
        <div class="h-[49px] flex justify-between items-center px-4 border-b">
          <p class="text-lg font-bold">Profile</p>
          <Button @click="emit('close')" size="iconSm" variant="ghost">
            <XIcon class="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div class="flex flex-col items-center justify-center p-4">
          <Avatar class="max-w-[256px] max-h-[256px] size-full rounded-[5px]">
            <AvatarImage :src="member.user.image || ''" />
            <AvatarFallback class="aspect-square text-6xl">
              {{ member?.user?.name?.[0] ?? "M" }}
            </AvatarFallback>
          </Avatar>
        </div>
        <div class="flex flex-col p-4">
          <p class="tex-xl font-bold">{{ member.user.name }}</p>

          <div
            v-if="
              currentMember?.role === 'admin' && currentMember?._id !== memberId
            "
            class="flex items-center gap-2 mt-4"
          >
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button variant="outline" class="w-full capitalize">
                  {{ member.role }} <ChevronDownIcon class="size-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent class="w-full">
                <DropdownMenuRadioGroup
                  :value="member.role"
                  @update:modelValue="
                    (role) => onUpdate(role as 'admin' | 'member')
                  "
                >
                  <DropdownMenuRadioItem value="admin">
                    Admin
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="member">
                    Member
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button @click="onRemove" variant="outline" class="w-full">
              Remove
            </Button>
          </div>

          <div
            v-else-if="
              currentMember?._id === memberId && currentMember?.role !== 'admin'
            "
            class="mt-4"
          >
            <Button @click="onLeave" variant="outline" class="w-full">
              Leave
            </Button>
          </div>
        </div>
        <Separator />
        <div class="flex flex-col p-4">
          <p class="text-sm font-bold mb-4">Contact information</p>
          <div class="flex items-center gap-2">
            <div
              class="size-9 rounded-md bg-muted flex items-center justify-center flex-shrink-0"
            >
              <MailIcon class="size-4" />
            </div>
            <div class="flex flex-col">
              <p class="text-[13px] font-semibold text-muted-foreground">
                Email Address
              </p>
              <a
                target="_blank"
                :href="`mailto:${member.user.email}`"
                class="text-sm hover:underline text-[#1264a3]"
              >
                {{ member.user.email }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </template>
  </template>
</template>
