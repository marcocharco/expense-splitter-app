declare interface GroupCardProps {
    groupName: String;
}

declare interface SidebarProps {
    user: User;
}

declare type User = {
    $id: string;
    email: string;
    firstName: string;
    lastName: string;
}