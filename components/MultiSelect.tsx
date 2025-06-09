"use client";
import { useState, useRef, useEffect } from "react";

type TransactionType = {
    id: string,
    username: string,
    userId: string,
    balance: Number,
};

function ChevronDownIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
    );
}

export default function MultiSelectDropdown({
    parsed,
    setParsed,
    selectedUsers,
    setSelectedUsers,
}: {
    parsed: TransactionType[];
    setParsed: React.Dispatch<React.SetStateAction<TransactionType[]>>;
    selectedUsers: TransactionType[];
    setSelectedUsers: React.Dispatch<React.SetStateAction<TransactionType[]>>;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [newUserName, setNewUserName] = useState("");

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    const toggleUser = (user: TransactionType) => {
        setSelectedUsers((prev) =>
            prev.some((u) => u.username === user.username)
                ? prev.filter((u) => u.username !== user.username)
                : [...prev, user]
        );
    };

    const handleAddUser = () => {
        const trimmedName = newUserName.trim();
        if (trimmedName && !parsed.some((u) => u.username === trimmedName)) {
            const newUser: TransactionType = {
                id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substr(2, 9),
                username: trimmedName,
                userId: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substr(2, 9),
                balance: 0,
            };
            setParsed((prev) => [...prev, newUser]);
            setNewUserName("");
        }
    };

    return (
        <div
            className="relative inline-block text-left w-64"
            ref={dropdownRef}
        >
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen((prev) => !prev);
                }}
                className="w-full flex items-center justify-between bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-left text-white focus:outline-none"
            >
                <span>
                    {selectedUsers.length === 0
                        ? "Select users"
                        : selectedUsers.map((u) => u.username).join(", ")}
                </span>
                <ChevronDownIcon
                    className={`w-5 h-5 transform transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"
                        }`}
                />
            </button>

            {isOpen && (
                <div
                    className="absolute z-10 mt-1 w-full bg-gray-800 border border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto transition-opacity duration-200 opacity-100"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Top Controls */}
                    <div className="flex justify-between items-center px-3 py-2 text-gray-400 text-sm border-b border-gray-700">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedUsers(parsed);
                            }}
                            className="hover:text-orange-400"
                        >
                            Select All
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedUsers([]);
                            }}
                            className="hover:text-orange-400"
                        >
                            Clear All
                        </button>
                    </div>

                    {/* User List */}
                    {parsed.map((user) => (
                        <label
                            key={user.username}
                            className="flex items-center px-3 py-2 text-gray-200 hover:bg-gray-700 cursor-pointer"
                        >
                            <input
                                type="checkbox"
                                checked={selectedUsers.some((u) => u.username === user.username)}
                                onChange={() => toggleUser(user)}
                                className="accent-orange-500 mr-2"
                            />
                            {user.username}
                        </label>
                    ))}

                    {/* Add New User */}
                    <div className="flex px-3 py-2 border-t border-gray-700 bg-gray-900">
                        <input
                            type="text"
                            value={newUserName}
                            onChange={(e) => setNewUserName(e.target.value)}
                            placeholder="New user name"
                            className="flex-grow bg-transparent text-gray-200 placeholder-gray-500 focus:outline-none"
                        />
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleAddUser();
                            }}
                            className="text-orange-400 hover:text-orange-500 ml-2"
                        >
                            Add
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
