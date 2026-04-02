Day 1–2: System Thinking (No Coding Focus)
Situation
A sudden event:

50,000 users join in 5 minutes

1 channel gets 80% of traffic

Problem
If you had only one server:

what fails first?

Task
Write (not code):

where bottlenecks will occur

what data grows fastest


What fails first (Single Server)
Network / Request handling
Too many incoming requests → queue overflow → timeouts
CPU overload
Can’t process all requests → slow response
Memory (RAM)
Too many active users/sessions → crash (OOM)
Database bottleneck
Same channel → heavy reads/writes → DB slows or fails
Lock contention
Many users updating same data → delays / deadlocks
📈 What data grows fastest
Messages / user activity (fastest)
Continuous writes from many users
Real-time events (fan-out)
One action → many updates
Logs / analytics
Every request generates data
Active sessions
High but stable
🧠 Key idea
Single server = bottleneck
Hot channel = uneven load
System fails due to overload + contention