contract Test {
    storage: map<Int, Int>;
    
    init() {
        self.storage = emptyMap();
    }
    
    fun test() {
        self.storage.s1et(1, 2); // Should suggest "set"
    }
    
    receive() {}
}