-- supabase/migrations/20240729120000_create_get_conversations_function.sql

create or replace function get_conversations_for_user(p_user_id uuid)
returns table (
    chat_id bigint,
    other_participant json,
    last_message json
)
as $$
begin
    return query
    with user_chats as (
        select cp.chat_id
        from chat_participants cp
        where cp.user_id = p_user_id
    ),
    other_participants as (
        select
            uc.chat_id,
            p.id as participant_id,
            p.full_name,
            p.avatar_url
        from user_chats uc
        join chat_participants cp on uc.chat_id = cp.chat_id
        join profiles p on cp.user_id = p.id
        where cp.user_id <> p_user_id
    ),
    ranked_messages as (
        select
            m.chat_id,
            m.content,
            m.created_at,
            m.sender_id,
            row_number() over(partition by m.chat_id order by m.created_at desc) as rn
        from messages m
        where m.chat_id in (select chat_id from user_chats)
    )
    select
        op.chat_id,
        json_build_object(
            'id', op.participant_id,
            'full_name', op.full_name,
            'avatar_url', op.avatar_url
        ) as other_participant,
        json_build_object(
            'content', lm.content,
            'created_at', lm.created_at,
            'sender_id', lm.sender_id
        ) as last_message
    from other_participants op
    left join ranked_messages lm on op.chat_id = lm.chat_id and lm.rn = 1;
end;
$$ language plpgsql;
