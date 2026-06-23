interface Ritual {
    id: string;
    title: string;
    isActive: boolean;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

interface RitualCardProps {
    ritual: Ritual;

    onDelete: (ritualId: string) => void;

    onToggleActive: (
        ritualId: string,
        isActive: boolean
    ) => void;
}

const RitualCard = ({
    ritual,
    onDelete,
    onToggleActive,
}: RitualCardProps) => {
    return (
        <div
            className="border rounded p-2 mb-2"
        >
            <div>{ritual.title}</div>

            <div className="flex">
                <div className="flex-4">
                    {ritual.isActive ? (
                        <button
                            className="border"
                            onClick={() =>
                                onToggleActive(
                                    ritual.id,
                                    false
                                )
                            }
                        >
                            🟢 Active
                        </button>
                    ) : (
                        <button
                            className="border"
                            onClick={() =>
                                onToggleActive(
                                    ritual.id,
                                    true
                                )
                            }
                        >
                            ⚫ Inactive
                        </button>
                    )}
                </div>

                <button
                    className="bg-red-600 flex-1"
                    onClick={() =>
                        onDelete(ritual.id)
                    }
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default RitualCard;